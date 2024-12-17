# backend/api/integrations/clients/base_client.py

from abc import ABC, abstractmethod


class BaseClient(ABC):
    _instances = {}  # Cache instances by some key (e.g. client type or config)

    def __new__(cls, *args, **kwargs):
        # You can define a key that uniquely identifies this client configuration.
        # For a simple scenario, use the class itself as the key if there's only one config per class.
        # Or if you have multiple configurations, build a tuple key from kwargs.
        key = (cls, tuple(sorted(kwargs.items())))

        if key not in cls._instances:
            instance = super().__new__(cls)
            cls._instances[key] = instance
        return cls._instances[key]

    def __init__(self, *args, **kwargs):
        # Since __init__ might be called multiple times (Python calls __init__ on every instantiation attempt),
        # we need to guard against reinitialization. A typical pattern is a flag:
        if getattr(self, "_initialized", False):
            return

        self._init_client(*args, **kwargs)
        self._initialized = True

    @abstractmethod
    def _init_client(self, *args, **kwargs):
        """To be implemented by subclasses with their specific initialization logic."""
        pass
