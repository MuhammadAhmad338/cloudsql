GOOGLE_PROJECT_ID=famous-rhythm-362419
CLOUD_RUN_SERVICE=barkbark-api-service
INSTANCE_CONNECTION_NAME=famous-rhythm-362419:us-central1:barkbark
DB_USER=root
DB_PASS=Ahmad@123
DB_NAME=dog_data

gcloud builds submit --tag gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \ 
   --project=$GOOGLE_PROJECT_ID

gcloud run deploy $CLOUD_RUN_SERVICE \ 
   --image gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \ 
   --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
   --update-env-vars INSTANCE_CONNECTION_NAME=$INSTANCE_CONNECTION_NAME,DB_PASS=$DB_PASS,DB_USER=$DB_USER,DB_NAME=$DB_NAME
   --platform managed \
   --region us-central1 \ 
   --allow-unauthenticated \
   --project=$GOOGLE_PROJECT_ID
