const url = "https://obstacle-odyssey-backend-d28a24245694.herokuapp.com";

export const postNewPlayer = async (data) => {
  try {
    const response = await fetch(`${url}/api/v1/players/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Could not POST data.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getLeaderboardData = async () => {
  try {
    const response = await fetch(`${url}/api/v1/players/`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
