declare global {
    interface Window {
      env: {
        BASE_URL: string;
        VERSION: string;
        COMPANY: string;
        TIME_OUT: number
      }
    }
  }
  
  const env = {
    BASE_URL: window.env.BASE_URL,
    VERSION: window.env.VERSION,
    COMPANY: window.env.COMPANY,
    TIME_OUT: window.env.TIME_OUT
  };
  
  export default env;
