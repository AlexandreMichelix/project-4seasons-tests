import React, { lazy, Suspense, useState } from "react";
import { isWithinInterval } from "date-fns";
import { ThemeProvider, createUseStyles } from "react-jss";

import Season from "./Season";
import data from "./data.json";
import ThemeButton from "./ThemeButton";

import "./Card.css";

const NextSeason = lazy(() => import("./NextSeason"));

const season = current(data.seasons);

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "system-ui",
    backgroundColor: ({ theme }) => (theme === "light" ? "white" : "black"),
    color: ({ theme }) => (theme === "light" ? "black" : "white"),
  },
  header: {
    width: "100%",
    justifyContent: "flex-end",
    textAlign: "-webkit-right",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginTop: 8,
    marginBottom: 8,
  },
  actions: {
    marginTop: 8,
    marginBottom: 8,
  },
});

const useStyles2 = createUseStyles({
  content: { marginTop: 8, marginBottom: 8 },
  actions: { marginTop: 8, marginBottom: 8 },
  button: {
    backgroundColor: "none",
    borderRadius: "5px",
    padding: "4px 8px",
    fontWeight: 700,
    cursor: "pointer",
    height: "50px",
    width: "150px",
  },
});

function App() {
  const [theme, setTheme] = useState("light");
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  const classes = useStyles({ theme });

  const [open, setOpen] = useState(false);
  const toggle2 = () => setOpen(!open);
  const classes2 = useStyles2();

  if (!open) {
    return (
      <ThemeProvider theme={{ type: theme, toggle }}>
        <div className="card">
          <div className={classes.root}>
            <header className={classes.header}>
              <ThemeButton />
              <main className={classes.main}>
                <div className={classes.content} data-testid="content">
                  <Season name={season[0]} />
                </div>
                <button className={classes2.button} onClick={toggle2}>
                  Next season ?
                </button>
              </main>
              <div className="card-body">
                <h5>{"Realized by Alexandre MICHELIX"}</h5>
              </div>
            </header>
          </div>
        </div>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={{ type: theme, toggle }}>
        <div className="card">
          <div className={classes.root}>
            <header className={classes.header}>
              <ThemeButton />
              <main className={classes.main}>
                <Suspense id="1" fallback={<div>Loading...</div>}>
                  <NextSeason name={season[1].next} />
                </Suspense>
                <button className={classes2.button} onClick={toggle2}>
                  I'll be back !
                </button>
              </main>
              <div className="card-body">
                <h5>{"Realized by Alexandre MICHELIX"}</h5>
              </div>
            </header>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;

export function current(seasons) {
  return Object.entries(seasons).filter(([name, season]) => {
    const currentYear = new Date().getFullYear();
    if (name === "winter") {
      return (
        isWithinInterval(new Date(), {
          start: new Date(
            currentYear - 1,
            season.beginAt.month - 1,
            season.beginAt.day
          ),
          end: new Date(currentYear, season.endAt.month - 1, season.endAt.day),
        }) ||
        isWithinInterval(new Date(), {
          start: new Date(
            currentYear,
            season.beginAt.month - 1,
            season.beginAt.day
          ),
          end: new Date(
            currentYear + 1,
            season.endAt.month - 1,
            season.endAt.day
          ),
        })
      );
    }
    return isWithinInterval(new Date(), {
      start: new Date(
        currentYear,
        season.beginAt.month - 1,
        season.beginAt.day
      ),
      end: new Date(currentYear, season.endAt.month - 1, season.endAt.day),
    });
  })[0];
}
