FROM mcr.microsoft.com/playwright/python:v1.42.0-jammy

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /app

# Copy files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

# Ensure browser is installed correctly in the container
RUN playwright install chromium

# Expose port
EXPOSE 8000

# Start the application using uvicorn
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
