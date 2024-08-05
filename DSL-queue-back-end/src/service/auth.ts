import axios from "axios";

export async function auth(code: string) {
  console.log("Authorization Code : ", code);
  console.log(process.env.GOOGLE_CLIENT_ID);
  console.log(process.env.GOOGLE_CLIENT_SECRET);
  const response = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "postmessage",
    grant_type: "authorization_code",
  });
  
  
  const accessToken = response.data.access_token;
  console.log("Access Token:", accessToken);

  // Fetch user details using the access token
  const userResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  const userDetails = userResponse.data;
  console.log("User Details:", userDetails);

  return userDetails;

}
