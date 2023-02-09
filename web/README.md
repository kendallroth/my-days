# My Days - Web Redirect Tool

The _direct_ mobile links for days shared from My Days via embedded messages are not visible in some clients, as it cannot parse the custom schema. Instead, these clients require an HTTP link that can be recognized as a link, allowing the user to select it and have the app opened via redirect.

- Parse an incoming mobile link and redirect to the app
- Manually parse a received message and redirect to the app

## Development

The app is developed as a simple static website, served through raw HTML and CSS files. In development, links may not work properly as there is no server to indicate that `index.html` files are served from their directory root.

## Deployment

The app is deployed via Netlify and hosted at `my-days.kendallroth.ca`. Updates can be simply dragged into the Netlify Deploy page and will roll out immediately.
