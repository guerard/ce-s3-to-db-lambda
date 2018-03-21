import { handler } from "./index";
handler(
  {
    Records: [
      {
        Sns: {
          Message: JSON.stringify({
            startId: Number(process.argv[2]),
            endId: Number(process.argv[3]),
          })
        }
      }
    ]
  },
  {},
  (error, result) => {
    if (error) {
      console.error(error.message);
      process.exit(1);
    } else {
      console.log(result);
      process.exit();
    }
  }
);
