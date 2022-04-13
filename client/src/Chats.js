import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import ScrollToBottom from "react-scroll-to-bottom";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
    marginTop: "20px",
    ".MuiGrid-container": {
      justifyContent: "center",
      alignItems: "center",
    },
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
    width: "inherit",
  },
});

export const Chats = ({ socket, username, room }) => {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      console.log("message recieved", data);
      setMessageList((prev) => [...prev, data]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        room,
        author: username,
        message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      socket.emit("send_message", messageData).then(() => {
        console.log("message sent");
        setMessageList((prev) => [...prev, messageData]);
        setMessage("");
      });
    }
  };

  const SendersBubble = ({ content, id }) => {
    return (
      <ListItem key={id}>
        <Grid container>
          <Grid item xs={12}>
            <ListItemText
              align="right"
              primary={content.message}
            ></ListItemText>
          </Grid>
          <Grid item xs={12}>
            <ListItemText
              align="right"
              secondary={content.time + " " + content.author}
            ></ListItemText>
          </Grid>
        </Grid>
      </ListItem>
    );
  };

  const RecieversBubble = ({ content, id }) => {
    return (
      <ListItem key={id}>
        <Grid container>
          <Grid item xs={12}>
            <ListItemText align="left" primary={content.message}></ListItemText>
          </Grid>
          <Grid item xs={12}>
            <ListItemText
              align=""
              secondary={content.author + " " + content.time}
            ></ListItemText>
          </Grid>
        </Grid>
      </ListItem>
    );
  };

  return (
    <Grid container component={Paper} className={classes.chatSection}>
      <ScrollToBottom className={classes.messageArea}>
        {messageList.length !== 0 ? (
          messageList.map((item, index) => {
            if (username !== item.author) {
              return <RecieversBubble content={item} id={index} />;
            } else {
              return <SendersBubble content={item} id={index} />;
            }
          })
        ) : (
          <p>
            You can't see previous messages of the room! Wait for new messages
            or send new messages...
          </p>
        )}
      </ScrollToBottom>
      <Divider />
      <Grid container component={Paper}>
        <Box
          sx={{
            display: "flex",
            width: "inherit",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <TextField
            id="outlined-basic-email"
            label="Type Something"
            fullWidth
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Box>
            <Fab color="primary" aria-label="add" onClick={sendMessage}>
              <SendIcon />
            </Fab>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
