import { useState } from "react";

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  return (
    <>
      <h1>Welcome</h1>
      <p>What should people call you</p>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(username);
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" />
      </form>
    </>
  );
};
export default Login;
