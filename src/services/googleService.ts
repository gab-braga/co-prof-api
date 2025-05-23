const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_AUTH_REDIRECT_URI;

async function getGoogleTokenWithAuthCode(code: string) {
  if (!code) {
    throw new Error("Código de autorização não fornecido.");
  }

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
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro na API Google.");
  }

  const data = await response.json();
  return data;
}

export { getGoogleTokenWithAuthCode };
