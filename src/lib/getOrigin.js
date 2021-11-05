export default function getOrigin() {
  return window.location.origin.includes('vizee.live')
    ? 'viz.ee'
    : window.location.origin;
}
