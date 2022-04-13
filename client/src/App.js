import React, { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { Button, TextField, Grid, Paper, Typography } from "@material-ui/core";
import { Chats } from "./Chats";
const socket = io.connect("https://n-chat-app-server.herokuapp.com/");
export const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = async () => {
    console.log("coming here", room);
    await socket.emit("join_room", room);
    setShowChat(true);
  };
  console.log("show chat", showChat);

  return (
    <div>
      {!showChat ? (
        <Grid container spacing={0} justify="center" direction="row">
          <Grid item>
            <Grid
              container
              direction="column"
              justify="center"
              spacing={2}
              className="login-form"
            >
              <Paper
                variant="elevation"
                elevation={2}
                className="login-background"
              >
                <Grid item>
                  <Typography component="h1" variant="h5">
                    Join A Room
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextField
                        type="text"
                        placeholder="Name"
                        fullWidth
                        name="name"
                        variant="outlined"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                        autoFocus
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        type="text"
                        placeholder="Room"
                        fullWidth
                        name="room"
                        value={room}
                        onChange={(event) => setRoom(event.target.value)}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={joinRoom}
                        className="button-block"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Chats username={username} room={room} socket={socket} />
      )}
    </div>
  );
};
