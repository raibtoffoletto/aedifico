export default function debounce(func = () => {}, delay = 666) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
