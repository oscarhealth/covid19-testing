// @flow
const BASE_URL = 'https://maps.googleapis.com/maps/api/js';
const CLIENT_ID = GOOGLE_MAPS_API_KEY;
const LIBRARIES = ['geometry', 'places'];

const Status = {
  UNINITIALIZED: 'UNINITIALIZED',
  READY: 'READY',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
};

/**
 * GoogleMapLoader loads the Google Maps API (if it hasn't loaded yet) and executes a callback once the script is
 * loaded. It should be called in each component that uses the Google Maps API.
 *
 * Usage:
 *   GoogleMapLoader.load(someCallback)
 */
const GoogleMapLoader = {
  _callbacks: [],
  _scriptSrc: `${BASE_URL}?libraries=${LIBRARIES.join(
    ','
  )}&key=${CLIENT_ID}`,
  _status: Status.UNINITIALIZED,

  // initialize should be called once when the file loads. It's responsible for setting the global googleMapsCallback
  // method.
  initialize() {
    if (this._status !== Status.UNINITIALIZED) {
      return;
    }

    window.googleMapsCallback = () => {
      this._status = Status.SUCCESS;
      this._callbacks.forEach((callback) => callback());
    };

    this._status = Status.READY;
  },

  // load should be called from every component that uses the Google Maps API. There are 3 states that it accounts for:
  //   1. load hasn't been called before. The method will register the callback and load the Google Maps API.
  //   2. load has been called, but the API hasn't loaded yet. The method registers the callback (which will be called
  //      by the Google Maps API once it finishes loading) and returns.
  //   3. The Google Maps API has already been loaded. The method will call the callback and return.
  load(callback: () => void, language: string = 'en') {
    if (this._status === Status.SUCCESS) {
      callback();
      return;
    }

    // Register callback.
    switch (this._status) {
      case Status.READY:
      case Status.LOADING: {
        this._callbacks.push(callback);
      }
    }

    if (this._status === Status.LOADING) {
      return;
    }

    this._status = Status.LOADING;

    const scriptRef = document.createElement('script');
    scriptRef.async = true;
    scriptRef.src = `${
      this._scriptSrc
    }&language=${language}&callback=googleMapsCallback`;

    // $FlowFixMe - document.body should always exist when GoogleMapLoader is called.
    document.body.appendChild(scriptRef);
  },
};

GoogleMapLoader.initialize();

export {GoogleMapLoader, Status};
