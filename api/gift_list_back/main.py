import os
import logging
from pathlib import Path

import uvicorn
from dotenv import load_dotenv
from starlette_prometheus import PrometheusMiddleware, metrics

from gift_list_back.app import app


LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": "%(levelprefix)s %(message)s",
            "use_colors": True,
        },
        "access": {
            "()": "uvicorn.logging.AccessFormatter",
            "fmt": '%(levelprefix)s %(client_addr)s - "%(request_line)s" %(status_code)s',  # noqa: E501
            "use_colors": True,
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
        "access": {
            "formatter": "access",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        },
    },
    "loggers": {
        "uvicorn": {"handlers": ["default"], "level": "INFO", "propagate": False},
        "uvicorn.error": {"level": "INFO"},
        "uvicorn.access": {"handlers": ["access"], "level": "INFO", "propagate": False},
    },
}

if __name__ == "__main__":
    if Path.cwd() == Path("/app"):
        in_docker = True
        env_file = Path(__file__).parents[1] / "config" / "localdocker.env"
    else:
        in_docker = False
        env_file = Path(__file__).parents[1] / "config" / "localdev.env"
    load_dotenv(dotenv_path=env_file, verbose=False)

    if in_docker:
        app.add_middleware(PrometheusMiddleware)
        app.add_route("/metrics/", metrics)
        uvicorn.run(app, host="0.0.0.0", port=5000, log_config=LOGGING_CONFIG)
    else:
        uvicorn.run("gift_list_back.app:app", host="0.0.0.0", port=8501, log_config=LOGGING_CONFIG, reload=True)
