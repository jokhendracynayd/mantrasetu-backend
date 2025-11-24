import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import type { RootState, AppDispatch } from "../../store/store";

import { logoutUser } from "../../store/slices/authSlice";

import Logo from "../Common/Logo";
import Button from "../Common/Button";
import Input from "../Common/Input";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Helper function to determine user role
  const getUserRole = () => {
    return user?.role || "USER";
  };

  // Helper function to check if user is pandit
  const isPandit = () => {
    return getUserRole() === "PANDIT";
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return getUserRole() === "ADMIN" || getUserRole() === "SUPER_ADMIN";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer>
      <Container>
        <HeaderContent>
          {/* Logo */}
          <LogoSection>
            <Link to="/">
              <Logo size="medium" />
            </Link>
          </LogoSection>

          {/* Navigation */}
          <Navigation>
            <NavLink to="/">Home</NavLink>

            <ServicesDropdown
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <ServicesLink>
                Services
                <DropdownIcon isOpen={isServicesDropdownOpen}>▼</DropdownIcon>
              </ServicesLink>

              <AnimatePresence>
                {isServicesDropdownOpen && (
                  <ServicesDropdownMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem to="/services">All Services</DropdownItem>
                    {isPandit() && (
                      <>
                        <DropdownItem to="/services/my-services">
                          My Services
                        </DropdownItem>
                        <DropdownItem to="/services/availability">
                          Set Availability
                        </DropdownItem>
                      </>
                    )}
                    {isAdmin() && (
                      <>
                        <DropdownItem to="/services/manage">
                          Manage Services
                        </DropdownItem>
                        <DropdownItem to="/services/analytics">
                          Analytics
                        </DropdownItem>
                      </>
                    )}
                  </ServicesDropdownMenu>
                )}
              </AnimatePresence>
            </ServicesDropdown>

            {/* Show different navigation based on authentication and role */}
            {isAuthenticated ? (
              <>
                {/* Regular user and pandit navigation */}
                <NavLink to="/bookings">My Bookings</NavLink>

                {/* Pandit-specific navigation */}
                {isPandit() && (
                  <>
                    <NavLink to="/pandit/dashboard">Pandit Dashboard</NavLink>
                    <NavLink to="/pandit/bookings">Manage Bookings</NavLink>
                    <NavLink to="/pandit/earnings">Earnings</NavLink>
                  </>
                )}

                {/* Admin-specific navigation */}
                {isAdmin() && (
                  <>
                    <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                    <NavLink to="/admin/users">Manage Users</NavLink>
                    <NavLink to="/admin/pandits">Manage Pandits</NavLink>
                    <NavLink to="/admin/services">Manage Services</NavLink>
                    <NavLink to="/admin/analytics">Analytics</NavLink>
                  </>
                )}

                <NavLink to="/contact">Contact Us</NavLink>
              </>
            ) : (
              <>
                {/* Non-authenticated user navigation */}
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/contact">Contact Us</NavLink>
              </>
            )}
          </Navigation>

          {/* Search Bar */}
          <SearchSection>
            <SearchForm onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon="search"
              />
            </SearchForm>
          </SearchSection>

          {/* Right Section */}
          <RightSection>
            {/* Language Selector */}
            <LanguageSelector>
              <LanguageButton
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
              >
                English
                <DropdownIcon isOpen={isLanguageDropdownOpen}>▼</DropdownIcon>
              </LanguageButton>

              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <LanguageDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LanguageOption
                      onClick={() => setIsLanguageDropdownOpen(false)}
                    >
                      Hindi
                    </LanguageOption>
                    <LanguageOption
                      onClick={() => setIsLanguageDropdownOpen(false)}
                    >
                      Tamil
                    </LanguageOption>
                    <LanguageOption
                      onClick={() => setIsLanguageDropdownOpen(false)}
                    >
                      Telugu
                    </LanguageOption>
                    <LanguageOption
                      onClick={() => setIsLanguageDropdownOpen(false)}
                    >
                      Sanskrit
                    </LanguageOption>
                  </LanguageDropdown>
                )}
              </AnimatePresence>
            </LanguageSelector>

            {/* User Actions */}
            <UserActions>
              {isAuthenticated ? (
                <>
                  {/* User Profile Icon */}
                  <UserIcon>
                    <Link
                      to={
                        isPandit()
                          ? "/pandit/profile"
                          : isAdmin()
                          ? "/admin/profile"
                          : "/profile"
                      }
                    >
                      <UserIconSvg>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      </UserIconSvg>
                    </Link>
                  </UserIcon>

                  {/* Show cart only for regular users */}
                  {!isPandit() && !isAdmin() && (
                    <CartIcon>
                      <Link to="/cart">
                        <CartIconSvg>
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </CartIconSvg>
                      </Link>
                    </CartIcon>
                  )}

                  {/* User role indicator */}
                  <UserRoleBadge>
                    {isPandit() ? "Pandit" : isAdmin() ? "Admin" : "User"}
                  </UserRoleBadge>

                  <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => navigate("/pandit-onboarding")}
                  >
                    🕉️ Pandit Ji
                  </Button>
                </>
              )}
            </UserActions>
          </RightSection>

          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={toggleMobileMenu}>
            <MenuIcon isOpen={isMenuOpen}>
              <span></span>
              <span></span>
              <span></span>
            </MenuIcon>
          </MobileMenuButton>
        </HeaderContent>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <MobileMenu
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MobileNav>
                <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </MobileNavLink>
                <MobileNavLink
                  to="/services"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </MobileNavLink>

                {/* Show different navigation based on authentication and role */}
                {isAuthenticated ? (
                  <>
                    <MobileNavLink
                      to="/bookings"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </MobileNavLink>
                    <MobileNavLink
                      to="/service-enrollment"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Enroll in Services
                    </MobileNavLink>

                    {/* Pandit-specific navigation */}
                    {isPandit() && (
                      <>
                        <MobileNavLink
                          to="/pandit/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Pandit Dashboard
                        </MobileNavLink>
                        <MobileNavLink
                          to="/pandit/bookings"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Manage Bookings
                        </MobileNavLink>
                        <MobileNavLink
                          to="/pandit/earnings"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Earnings
                        </MobileNavLink>
                      </>
                    )}

                    {/* Admin-specific navigation */}
                    {isAdmin() && (
                      <>
                        <MobileNavLink
                          to="/admin/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </MobileNavLink>
                        <MobileNavLink
                          to="/admin/users"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Manage Users
                        </MobileNavLink>
                        <MobileNavLink
                          to="/admin/pandits"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Manage Pandits
                        </MobileNavLink>
                        <MobileNavLink
                          to="/admin/analytics"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Analytics
                        </MobileNavLink>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Non-authenticated user navigation */}
                    <MobileNavLink
                      to="/services"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Services
                    </MobileNavLink>
                  </>
                )}

                <MobileNavLink
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </MobileNavLink>

                {!isAuthenticated && (
                  <MobileAuthButtons>
                    <Button
                      variant="outline"
                      size="medium"
                      fullWidth
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      size="medium"
                      fullWidth
                      onClick={() => {
                        navigate("/register");
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                    <Button
                      variant="secondary"
                      size="medium"
                      fullWidth
                      onClick={() => {
                        navigate("/pandit-onboarding");
                        setIsMenuOpen(false);
                      }}
                    >
                      🕉️ Register as Pandit Ji
                    </Button>
                  </MobileAuthButtons>
                )}
              </MobileNav>
            </MobileMenu>
          )}
        </AnimatePresence>
      </Container>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  width: 100%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  width: 100%;
  box-sizing: border-box;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  gap: ${({ theme }) => theme.spacing[6]};
  width: 100%;
  min-width: 0;

  @media (max-width: 768px) {
    height: 70px;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const LogoSection = styled.div`
  flex-shrink: 0;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.fast};
  }

  &:hover::after {
    width: 100%;
  }
`;

const ServicesDropdown = styled.div`
  position: relative;
`;

const ServicesLink = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DropdownIcon = styled.span<{ isOpen: boolean }>`
  font-size: 10px;
  transition: transform ${({ theme }) => theme.transitions.fast};
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const ServicesDropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing[2]};
  min-width: 200px;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const SearchSection = styled.div`
  flex: 1;
  max-width: 300px;
  min-width: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchForm = styled.form`
  width: 100%;
`;

const SearchInput = styled(Input)`
  width: 100%;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const LanguageSelector = styled.div`
  position: relative;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LanguageButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const LanguageDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing[2]};
  min-width: 120px;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const LanguageOption = styled.button`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: left;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const UserIcon = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserIconSvg = styled.svg`
  width: 20px;
  height: 20px;
  stroke: ${({ theme }) => theme.colors.textSecondary};
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const CartIcon = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const CartIconSvg = styled.svg`
  width: 20px;
  height: 20px;
  stroke: ${({ theme }) => theme.colors.textSecondary};
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const UserRoleBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};

  @media (max-width: 768px) {
    display: block;
  }
`;

const MenuIcon = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 24px;
  height: 18px;

  span {
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.textPrimary};
    transition: all ${({ theme }) => theme.transitions.fast};
    transform-origin: center;
  }

  ${({ isOpen }) =>
    isOpen &&
    `
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  `}
`;

const MobileMenu = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  overflow: hidden;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNav = styled.nav`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const MobileNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

export default Header;
