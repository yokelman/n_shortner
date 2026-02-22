# n_shortner

URL shortener service with additional features!

## Live Demo
Check out the website [here](https://n-shortner.onrender.com/)!

## Self-hosting
```
git clone https://github.com/Aayush4527f/n_shortner
cd n_shortner
cp .env.example .env
npm i
npm start
```
NOTE: Make sure to fill valid keys in `.env`

## Features
- Shorten links with codes
- URL is mapped to a 6 digit code, which is saved in a MongoDB database
- Takes constant time to map
- Takes snapshots (previews) of websites via [Microlink](https://microlink.io/) which are visible on the home page

## Future scope
- Expiring links
- Filter websites by tags/categories
- Latest page (Websites entered by users recently)

## License
[MIT](https://github.com/Aayush4527f/n_shortner/blob/main/LICENSE)
