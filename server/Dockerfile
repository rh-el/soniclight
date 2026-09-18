FROM node:25
WORKDIR /app
RUN mkdir -p /app/node_modules && chown -R node:node /app
USER node
EXPOSE 8000
CMD ["npm", "run", "dev"]
