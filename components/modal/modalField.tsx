interface ModalFieldProps {
  keyName: string;
  value?: string | number;
  onChange: (key: string, value: string | number) => void;
}

const calculateAgeFromBirthDate = (raw: string) => {
  const birthDate = new Date(raw);
  if (isNaN(birthDate.getTime())) return 0;

  const now = new Date();
  let years = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - birthDate.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < birthDate.getUTCDate())) {
    years--;
  }
  return Math.max(0, years);
};

export default function ModalField({ keyName, value, onChange }: ModalFieldProps) {
  switch (keyName) {
    case "petType":
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-muted-700 dark:text-muted-200">
            Pet Type
          </label>
          <select
            className="select"
            value={(value as string) || ""}
            onChange={(e) => onChange(keyName, e.target.value)}
          >
            <option value="" disabled>
              Select Pet Type
            </option>
            <option value="Dog">Dog 🐶</option>
            <option value="Cat">Cat 🐱</option>
            <option value="Parrot">Parrot 🦜</option>
            <option value="Other">Other 🐾</option>
          </select>
        </div>
      );

    case "birthDate":
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-muted-700 dark:text-muted-200">
            Pet Birth Date
          </label>
          <input
            type="date"
            className="input"
            value={(value as string) || ""}
            onChange={(e) => {
              const raw = e.target.value;
              onChange("birthDate", raw);
              onChange("petAge", calculateAgeFromBirthDate(raw));
            }}
          />
        </div>
      );

    default:
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium capitalize text-muted-700 dark:text-muted-200">
            {keyName}
          </label>
          <input
            className="input"
            autoFocus={keyName === "name"}
            value={(value as string) || ""}
            onChange={(e) => onChange(keyName, e.target.value)}
          />
        </div>
      );
  }
}
