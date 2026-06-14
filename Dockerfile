FROM node:20-alpine AS dependencies
# install system dependencies
RUN apk --no-cache --virtual build-dependencies add python3 make g++
WORKDIR /jupitoweb
COPY package.json package-lock.json ./
# install node dependencies
RUN npm install
FROM node:20-alpine AS builder
WORKDIR /jupitoweb
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
COPY --from=dependencies /jupitoweb/node_modules ./node_modules
COPY . .
# create production build
RUN npm run build
# remove dev dependencies
RUN npm prune --production
FROM node:20-alpine AS runner
WORKDIR /jupitoweb

# copy static files
COPY --from=builder /jupitoweb/.next/standalone ./
COPY --from=builder /jupitoweb/.next/static ./.next/static
COPY --from=builder /jupitoweb/public ./public

# expose port 3000
EXPOSE 3000
CMD ["node", "server.js"]
