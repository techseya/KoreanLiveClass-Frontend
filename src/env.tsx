declare global {
    interface Window {
      env: {
        BASE_URL: string;
        VERSION: string;
        COMPANY: string;
      }
    }
  }
  
  const env = {
    BASE_URL: window.env.BASE_URL,
    VERSION: window.env.VERSION,
    COMPANY: window.env.COMPANY
  };
  
  export default env;
