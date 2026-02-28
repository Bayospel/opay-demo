import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RewardIcon from '@mui/icons-material/Stars';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';

const BottomNav = () => {
    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
        >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Rewards" icon={<RewardIcon />} />
            <BottomNavigationAction label="Finance" icon={<AccountBalanceWalletIcon />} />
            <BottomNavigationAction label="Cards" icon={<CardIcon />} />
            <BottomNavigationAction label="Me" icon={<PersonIcon />} />
        </BottomNavigation>
    );
};

export default BottomNav;
