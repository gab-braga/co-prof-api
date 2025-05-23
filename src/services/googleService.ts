const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_CLIENT_REDIRECT_URI;

async function getGoogleTokenWithAuthCode(code: string) {
  const redirectUriEncoded = encodeURIComponent(redirectUri as string);
  const grantType = "authorization_code";

  const authUrl =
    `https://oauth2.googleapis.com/token?` +
    `client_id=${clientId}&` +
    `client_secret=${clientSecret}&` +
    `redirect_uri=${redirectUriEncoded}&` +
    `grant_type=${grantType}&` +
    `code=${code}`;

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return await response.json();
}

export { getGoogleTokenWithAuthCode }