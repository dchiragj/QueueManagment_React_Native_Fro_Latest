let API_KEY;


let Geocoder;
export default Geocoder = {
  options: {},

  
  init(apiKey, options) {
    API_KEY = apiKey;
    this.options = options || {};
  },

  
  get isInit() {
    return !!API_KEY;
  },

  
  setApiKey(API_KEY) {
    this.init(API_KEY);
  },

  async from(...params) {
    if (!Geocoder.isInit)
      throw {
        code: Geocoder.Errors.NOT_INITIATED,
        message:
          "Geocoder isn't initialized. Call Geocoder.init function (only once), passing it your app's api key as parameter."
      };

    let queryParams;

    if (!isNaN(params[0]) && !isNaN(params[1])) queryParams = { latlng: `${params[0]},${params[1]}` };
    else if (params[0] instanceof Array) queryParams = { latlng: `${params[0][0]},${params[0][1]}` };
    else if (params[0] instanceof Object)
      queryParams = { latlng: `${params[0].lat || params[0].latitude},${params[0].lng || params[0].longitude}` };
    else if (typeof params[0] === 'string') queryParams = { address: params[0] };


    if (!queryParams)
      throw {
        code: Geocoder.Errors.INVALID_PARAMETERS,
        message: 'Invalid parameters : \n' + JSON.stringify(params, null, 2)
      };

    queryParams.key = API_KEY;
    if (this.options.language) queryParams.language = this.options.language;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?${toQueryParams(queryParams)}`;

    let response, data;

    try {
      response = await fetch(url);
    } catch (error) {
      throw {
        code: Geocoder.Errors.FETCHING,
        message: 'Error while fetching. Check your network.',
        origin: error
      };
    }

    try {
      data = await response.json();
    } catch (error) {
      throw {
        code: Geocoder.Errors.PARSING,
        message:
          "Error while parsing response's body into JSON. The response is in the error's 'origin' field. Try to parse it yourself.",
        origin: response
      };
    }

    if (data.status !== 'OK')
      throw {
        code: Geocoder.Errors.SERVER,
        message:
          "Error from the server while geocoding. The received datas are in the error's 'origin' field. Check it for more informations.",
        origin: data
      };

    return data;
  },

  getFromLocation(address) {
    return this.from(address);
  },

  getFromLatLng(lat, lng) {
    return this.from(lat, lng);
  },

  
  Errors: {
    
    NOT_INITIATED: 0,

    
    INVALID_PARAMETERS: 1,

    
    FETCHING: 2,

    
    PARSING: 3,

    
    SERVER: 4
  }
};


function toQueryParams(object) {
  return Object.keys(object)
    .filter((key) => !!object[key])
    .map((key) => key + '=' + encodeURIComponent(object[key]))
    .join('&');
}
