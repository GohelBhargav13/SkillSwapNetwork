class ApiClient {
  constructor() {
    this.baseURL = "http://localhost:5000/api/v1";
    this.allowedHeader = {
      Accept: "application/json",
    };
  }

  async customFetch(pathUrl, options = {}) {
    try {
      const url = `${this.baseURL}${pathUrl}`;
      const headers = { ...this.allowedHeader, ...options.headers };

      console.log(headers);

      //for the form data accept
      // if(options.body instanceof FormData){
      //   delete headers["Content-Type"]
      // }

      const config = {
        ...options,
        headers,
        credentials: "include",
      };

      const response = await fetch(url, config);
      const data = await response.json();

      console.log(`Data Are Fetching from ${url}`);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

    async singUP(email, name, password, user_avatar) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", password);
      formData.append("user_avatar", user_avatar);

      return this.customFetch("/user/register", {
        method: "POST",
        body: formData,
      });
    }

  async VerifyEmail(token) {
    return this.customFetch(`/user/verify/${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  async Login(email, password) {
    return this.customFetch("/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.customFetch("/user/getme", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
  }

  async logOut() {
    return this.customFetch("/user/logout", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
  }

  //Post Api fetching
  async getAllPost() {
    return this.customFetch("/post/getall", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
  }

  //Like in post
  async likePost(postId) {
    return this.customFetch(`/post/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  }

  //Comment in post
  async commentPost(postId, comment) {
    return this.customFetch(`/post/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
  }

  //LeaderBoard Data Fetch
  async fetchLeaderBoard() {
    return this.customFetch("/leaderboard/userlist", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  async CreatePost(title, desc, postImages) {
    const fb = new FormData();
    fb.append("title", title);
    fb.append("description", desc);
    if (postImages) fb.append("post_images", postImages);

    console.log(fb);
    return this.customFetch(`/post/createpost`, {
      method: "POST",
      body: fb,
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
