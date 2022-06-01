import eye from "./Images/eye.JPG";
import "./App.css";
import { ChatClient, UserState } from "twitch-chat-client";
import { ApiClient } from "twitch";
import {
  AccessToken,
  RefreshableAuthProvider,
  StaticAuthProvider,
} from "twitch-auth";
import { useState, useEffect, useRef } from "react";
import * as tmi from "tmi.js";

function App() {
  // const wordTimeout = useRef(null);

  // const CLIENT_ID = "go089r4gr7617enh9rom64u82s7p7t";
  // const CLIENT_SECRET = "jayeizm4iuu9acu05ld47l3af7vjyq";
  // const ACCESS_TOKEN = "h67ma9vszn4e056vqp7rtsoeemnhmz";

  const [word, setWord] = useState("Gamers");
  const [def, setDef] = useState(
    "good, fuckin great, awesome -urban dictionary",
  );
  const [previousWord, setPreviousWord] = useState(word);
  const [sender, setSender] = useState("Potaten2015");
  const [prevSender, setPrevSender] = useState(sender);
  const [subscribed, setSubscribed] = useState(true);
  const [prevSubscribed, setPrevSubscribed] = useState(subscribed);
  const [client, setClient] = useState(null);
  useEffect(async () => {
    await fetch(`/define/${word}`)
      .then((def1) => def1.json())
      .then((def2) => {
        if (def2) {
          const defParsed = JSON.parse(def2);
          if (defParsed && defParsed.list && defParsed.list[0]) {
            const definition = defParsed.list[0].definition;
            if (definition) {
              setDef(
                definition
                  .split("\n")[0]
                  .replace("1.", "")
                  .replace("\r", "")
                  .replace(/[\[\]]/g, ""),
              );
              setPreviousWord(word);
              setPrevSender(sender);
              setPrevSubscribed(subscribed);
            }
          } else {
            setWord(previousWord);
            setSender(prevSender);
            setSubscribed(prevSubscribed);
          }
        }
      });
  }, [word]);

  useEffect(() => {
    const BOT_USERNAME = "Potaten2015";
    const CHANNEL_NAME = "Potaten2015";
    const OAUTH_TOKEN = "oauth:97p2amtz0p2l3mzrd8vy0cplq1g5bn";

    const opts = {
      identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN,
      },
      channels: [CHANNEL_NAME],
    };
    // Create a client with our options
    setClient(new tmi.client(opts));
    // Connect to Twitch:
  }, []);

  useEffect(() => {
    if (client) {
      // Define configuration options

      // Called every time a message comes in
      const onMessageHandler = (target, context, msg, self) => {
        if (self) {
          return;
        } // Ignore messages from the bot

        console.log("target", target);

        console.log("context", context);

        console.log("self", self);

        // Remove whitespace from chat message
        const commandName = msg.trim();

        if (commandName && commandName.startsWith("!word")) {
          setWord(commandName.slice(6));
          setSender(context["display-name"]);
          setSubscribed(context["subscriber"]);
        }
      };

      // Called every time the bot connects to Twitch chat
      const onConnectedHandler = (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`);
      };

      client.connect();

      client.on("message", onMessageHandler);
      client.on("connected", onConnectedHandler);

      if (client) {
        setInterval(() => {
          if (client) client.say("type '!word <your word>' for the definition");
        }, 10000);
      }
    }
  }, [client]);

  return (
    <div className="App">
      <div className="Video-background"></div>
      <header className="App-header">
        <div className="Header-left-outer">
          <div className="Header-left">
            Word of the chat from <span className="Sender"> {sender}</span>{" "}
            <span className="wod">{word.toUpperCase()}</span>
          </div>
          {!subscribed ? (
            <div className="Subscribe">Subscribe pussy boi {sender}</div>
          ) : (
            <div className="Subscribe">Thanks for being a sub :)</div>
          )}
        </div>
        <div className="Center-header">
          <div className="Center">
            <h1 className="">
              Potaten2015<div className="Patreon">patreon.com/potaten2015</div>
            </h1>
            <img src={eye} alt="logo" className="spinning_eye" />
          </div>
        </div>
        <div className="Header-right">
          Definition: <span className="def">{def.toUpperCase()}</span>
        </div>
      </header>
    </div>
  );
}

export default App;
