import React, { useState } from 'react';

export interface Tab {
    id: string;
    title: string;
    content: JSX.Element;
}

export interface TabsProps {
    tabs: Tab[];
    onTabClick?: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, onTabClick }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const handleClick = (tabId: string) => {
        setActiveTab(tabId);
        onTabClick && onTabClick(tabId);
    };
    return (
        <div>
            <ul className='tab-list list-reset flex'>
                {tabs.map((tab) => (
                    <li key={tab.id} onClick={() => handleClick(tab.id)} className='products__item'>
                        <button className={tab.id === activeTab ? 'active btn products__button button-reset products__btn' : 'btn products__button button-reset products__btn'}>{tab.title}</button>
                    </li>
                ))}
            </ul>
            <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
        </div>
    );
};

export default Tabs;