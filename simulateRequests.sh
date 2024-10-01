#!/bin/bash

# Verificar que se pasaron los argumentos correctos
if [ "$#" -lt 3 ]; then
  echo "Uso: $0 <host> <puerto> <ruta> <cantidad de solicitudes>"
  exit 1
fi

# Parámetros del script
HOST=$1
PORT=$2
ENDPOINT=$3
REQUESTS=${4:-1}  # Cantidad de solicitudes

# Lista de URLs de productos
URLS=(
  "https://www.amazon.com/gp/product/B0CXG3HMX1"
  "https://www.amazon.com/gp/product/B0CVS1XHJL"
  "https://www.amazon.com/gp/product/B0CVBL2J34"
  "https://www.amazon.com/gp/product/B0CVS18PH9"
)

URL_COUNT=${#URLS[@]}

# Realizar solicitudes
for ((i = 0; i < REQUESTS; i++)); do
  URL_INDEX=$((i % URL_COUNT))  # Asegurarse de que no se repita hasta que se hayan usado todas las URLs
  URL=${URLS[$URL_INDEX]}
  
  echo "Enviando solicitud para URL: $URL"
  
  curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0" "http://$HOST:$PORT/$ENDPOINT?url=$URL"

  echo ""

  sleep 1 

done
