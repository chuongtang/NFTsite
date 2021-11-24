import './App.css';
import twitterLogo from './assets/twitter-logo.svg';


// styling package
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.61/dist/');
import { SlButton, SlBadge } from '@shoelace-style/shoelace/dist/react';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // Render Methods
  const renderNotConnectedContainer = () => (
    <SlButton type="warning" size="large">
      Connect to Wallet
    </SlButton>
  );

  return (
    <div className="App">
      <div className="-container">
        <header >
          <h1>My <span style={{ "color": "#D97706"}}>NFT</span> Collection</h1>
        </header>
        <h2 className="sub-text">
          Each unique. Each beautiful. Discover your NFT today.
        </h2>
        {renderNotConnectedContainer()}

          <div className="badge-pulse ftr">
            <SlBadge type="warning" pill pulse>
              <sl-icon name="twitter"></sl-icon>

              <a
                className="sl-color-neutral-0"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
              >{`   Happily built on @${TWITTER_HANDLE}`}</a>
            </SlBadge>
          </div>
      </div>
    </div>
  );
};

export default App;