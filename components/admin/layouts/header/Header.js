import React, { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  Button,
} from "reactstrap";

import { AuthContext } from "../../../../stores/authContext";
import { UserLoggedContext } from "../../../../stores/userLoggedContext";

const Header = ({ showMobmenu }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const {loggoutAuth} = useContext(AuthContext)
  const {userLoggout} = useContext(UserLoggedContext)

  const router = useRouter()

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    loggoutAuth()
    userLoggout()
    router.push('/login')
  }

  return (
    <Navbar color="secondary" dark expand="md">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/admin/users" className="d-lg-none">
          {/* <Image src={LogoWhite} alt="logo" /> */}
        </NavbarBrand>
        <Button color="secondary" className="d-lg-none" onClick={showMobmenu}>
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2">
        <Button
          color="secondary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link href="#">
              <a onClick={handleLogout} className="nav-link">Logout</a>
            </Link>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
