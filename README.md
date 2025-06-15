## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

### Running both backend and frontent

1. Create docker network:

```bash
docker network create shared-network
```

2. Start backend:
   ```bash
   docker-compose up --build
   ```
3. Start frontend:
   ```bash
   docker-compose up --build
   ```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3030:3030 my-app
```