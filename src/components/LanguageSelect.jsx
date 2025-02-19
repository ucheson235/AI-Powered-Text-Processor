function LanguageSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded bg-white text-black"
    >
      <option value="en">English</option>
      <option value="pt">Portuguese</option>
      <option value="es">Spanish</option>
      <option value="ru">Russian</option>
      <option value="tr">Turkish</option>
      <option value="fr">French</option>
    </select>
  );
}

export default LanguageSelect;