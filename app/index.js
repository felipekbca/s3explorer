import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { useTheme, MuiThemeProvider, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import HomePage from './containers/HomePage';
import './app.global.css';

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      dark: '#fff',
      main: '#fff',
      // dark: será calculada com base em palette.secondary.main,
      contrastText: '#fff',
    },
  },
});

render(
  <ThemeProvider theme={darkTheme}>
    <HomePage />
  </ThemeProvider>,
  document.getElementById('root')
);