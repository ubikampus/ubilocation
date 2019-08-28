import app from './app';

const PORT = 3001;

// Used by CI pipeline for verifying type checking passes.
if (process.env.TYPECHECK) {
  console.log('type check success!');
  process.exit(0);
}

app.listen(PORT, () => {
  console.log('Listening at', PORT);
});
