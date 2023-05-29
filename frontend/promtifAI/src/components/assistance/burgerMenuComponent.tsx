import { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Hamburger from 'hamburger-react';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';

export default function BurgerMenu() {
  const [isOpen, setOpen] = useState(false);
  const handleStateChange = (state: any) => {
    setOpen(state.isOpen);
  };
  const navigate = useNavigate()
  const id = window.location.pathname.split('/')[2];
  const MyCabinetNavigate = () => {
    navigate(`/cabinet/${id}`)
  }
  return (
    <div className='burger burger__menu'>
      <Hamburger toggled={isOpen} toggle={setOpen} />
      <Menu isOpen={isOpen} onStateChange={handleStateChange}>
        <ul className='list-reset flex'>
          <li className='burger__item'>
            <div className='header__content burger__content header__background burger__background'>
              <Link
                className="header__link burger__link link-reset"
                to="aboutUs"
                smooth={true}
                duration={500}
                onClick={() => setOpen(false)}
              >
                About us
              </Link>
            </div>
          </li>
          <li className='burger__item'>
            <div className='header__content burger__content header__background burger__background header__background__2'>
              <Link
                className="header__link burger__link link-reset"
                to="products"
                smooth={true}
                duration={500}
                onClick={() => setOpen(false)}
              >
                Products
              </Link>
            </div>
          </li>
          <li className='burger__item'>
            <div className='header__content burger__content header__background burger__background header__background__3'>
              <Link
                className="header__link burger__link link-reset"
                to="reviews"
                smooth={true}
                duration={500}
                onClick={() => setOpen(false)}
              >
                Reviews
              </Link>
            </div>
          </li>
          <li className='burger__item'>
            <div className='header__content burger__content header__background burger__background header__background__4'>
              <Link
                className="header__link burger__link link-reset"
                to="contacts"
                smooth={true}
                duration={500}
                onClick={() => setOpen(false)}
              >
                Contacts
              </Link>
            </div>
          </li>
        </ul>
        <div className='header__content burger__content header__background burger__background header__background__5'>
          <a className='header__link burger__link link-reset' onClick={() => { setOpen(false); MyCabinetNavigate() }}>
            My cabinet
          </a>
        </div>
      </Menu>
    </div>
  );
}