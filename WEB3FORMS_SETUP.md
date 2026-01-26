# Web3Forms Setup Instructions

## Configuration

The contact form is configured to use Web3Forms with the following settings:

- **Access Key**: `043e1710-1882-450f-a66e-86093869654d`
- **Recipient Email**: `berger@promopers.com`

## Setting Up the Environment Variable in Vercel

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add the following variable**:
   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=043e1710-1882-450f-a66e-86093869654d
   ```

3. **Click Save** and **Redeploy** your application

## Local Development

For local development, you can create a `.env.local` file in the root of your project:

   ```
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=043e1710-1882-450f-a66e-86093869654d
```

**Note**: The form will work without the environment variable locally (it uses the access key as fallback), but it's recommended to set it up properly.

## Important Notes

- The `.env.local` file is already in `.gitignore`, so it won't be committed to your repository
- Never share your access key publicly
- All form submissions will be sent to `berger@promopers.com`
- You can also view submissions in your Web3Forms dashboard

## Testing

Once you've set up the access key and restarted the server:
1. Go to the contact page
2. Fill out the form
3. Submit it
4. You should see a success toast notification
5. Check your Web3Forms dashboard or email for the submission

## Troubleshooting

If you see an error message about the access key not being configured:
- Make sure the `.env.local` file exists in the project root
- Verify the variable name is exactly: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
- Ensure there are no spaces around the `=` sign
- Restart your development server after making changes

