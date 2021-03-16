FROM python:3.9.1-buster

RUN pip install poetry
RUN poetry config virtualenvs.create false

WORKDIR /app
COPY poetry.lock /app/
COPY pyproject.toml /app/

RUN poetry install --no-dev

COPY gift_list_back /app/gift_list_back

RUN poetry install --no-dev

CMD ["python", "/app/gift_list_back/main.py"]
