FROM python:3.8.0-slim

RUN pip install flask

COPY src /app
WORKDIR /app

EXPOSE 5000

# Don't run as root
USER 1000

CMD ["python", "server.py"]
