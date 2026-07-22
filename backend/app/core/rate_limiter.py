from slowapi import Limiter
from slowapi.util import get_remote_address


## API Rate Limiting (Limiting API Calls/minute to prevent DDoS Attack)
limiter = Limiter(key_func = get_remote_address, default_limits = ["100/minute"])