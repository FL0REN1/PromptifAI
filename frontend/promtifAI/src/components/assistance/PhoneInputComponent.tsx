import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneInputComponentProps {
  onIsValidChange: (isValid: boolean) => void;
  phone: string;
}

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({ onIsValidChange, phone }) => {
  const [phoneNumber, setPhoneNumber] = useState('1');
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);    
  };

  return (
    <PhoneInput
      isValid={(value, country: any) => {
        const validLengthsByCountry = {
          us: 11,
          gb: 12,
          de: 14,
          fr: 11,
          it: 12,
          es: 11,
          ua: 12,
          cn: 13,
          jp: 12,
          mx: 12,
        };
        const maxLength = validLengthsByCountry[country?.iso2 || ''];
        if (value.replace(/\D/g, '').length !== maxLength) {
          onIsValidChange(false);
          return `Phone number should contain ${maxLength} digits for ${country?.name}`;
        }
        else {
          phone = phoneNumber;
          onIsValidChange(true);
        }
        return true;
      }}
      country={'ua'}
      onlyCountries={['us', 'gb', 'de', 'fr', 'it', 'es', 'ua', 'cn', 'jp', 'mx']}
      excludeCountries={['ru']}
      value={phoneNumber}
      onChange={handlePhoneChange}
      inputClass={phoneNumber ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'}
      inputProps={{
        name: 'phone',
        autoFocus: true,
        placeholder: 'Enter phone number',
      }}
    />
  );
};

export default PhoneInputComponent;