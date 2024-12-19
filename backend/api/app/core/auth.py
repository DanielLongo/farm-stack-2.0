from dataclasses import dataclass
from fastapi import Depends

import jwt

from app.core.exceptions import (
    BadCredentialsException,
    UnableCredentialsException,
)
from starlette.requests import Request as StarletteRequest
from app.core.exceptions import PermissionDeniedException
from typing import NamedTuple
from app.core.exceptions import (
    BadCredentialsException,
    RequiresAuthenticationException,
)


from app.core.constants import AUTH0_DOMAIN, AUTH0_AUDIENCE


class AuthorizationHeaderElements(NamedTuple):
    authorization_scheme: str
    bearer_token: str
    are_valid: bool


def get_authorization_header_elements(
    authorization_header: str,
) -> AuthorizationHeaderElements:
    try:
        authorization_scheme, bearer_token = authorization_header.split()
    except ValueError:
        raise BadCredentialsException
    else:
        valid = authorization_scheme.lower() == "bearer" and bool(bearer_token.strip())
        return AuthorizationHeaderElements(authorization_scheme, bearer_token, valid)


def get_bearer_token(request: StarletteRequest) -> str:
    authorization_header = request.headers.get("Authorization")
    if authorization_header is None:
        raise RequiresAuthenticationException
    if len(authorization_header.split("Bearer ")) != 2:
        raise BadCredentialsException
    return authorization_header.split("Bearer ")[1]


@dataclass
class JsonWebToken:
    """Perform JSON Web Token (JWT) validation using PyJWT"""

    jwt_access_token: str
    auth0_issuer_url: str = f"https://{AUTH0_DOMAIN}/"
    auth0_audience: str = AUTH0_AUDIENCE
    algorithm: str = "RS256"
    jwks_uri: str = f"{auth0_issuer_url}.well-known/jwks.json"

    def validate(self):
        try:
            jwks_client = jwt.PyJWKClient(self.jwks_uri)
            jwt_signing_key = jwks_client.get_signing_key_from_jwt(
                self.jwt_access_token
            ).key
            payload = jwt.decode(
                self.jwt_access_token,
                jwt_signing_key,
                algorithms=self.algorithm,  # type: ignore
                audience=self.auth0_audience,
                issuer=self.auth0_issuer_url,
            )
        except jwt.exceptions.PyJWKClientError:
            raise UnableCredentialsException
        except jwt.exceptions.InvalidTokenError as e:

            raise BadCredentialsException
        return payload


def validate_token(token: str = Depends(get_bearer_token)) -> dict:
    return JsonWebToken(token).validate()


class PermissionsValidator:
    def __init__(self, required_permissions: list[str]):
        self.required_permissions = required_permissions

    def __call__(self, token: str = Depends(validate_token)):
        token_permissions = token.get("permissions")  # type: ignore
        token_permissions_set = set(token_permissions)
        required_permissions_set = set(self.required_permissions)

        if not required_permissions_set.issubset(token_permissions_set):
            raise PermissionDeniedException
