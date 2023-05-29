import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

export interface Tab {
    id: string;
    title: string;
    content: JSX.Element;
}

export interface TabsProps {
    tabs: Tab[];
    onTabChange?: (id: string) => void;
}

const SelectTab: React.FC<TabsProps> = ({ tabs, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const handleTabChange = (newValue: SingleValue<{ value: string; label: string | undefined; }>) => {
        const tabId = newValue?.value;
        if (tabId) {
            setActiveTab(tabId);
            onTabChange && onTabChange(tabId);
        }
    };

    const options = tabs.map((tab) => ({ value: tab.id, label: tab.title }));
    const value = { value: activeTab, label: tabs.find((tab) => tab.id === activeTab)?.title };

    return (
        <div>
            <Select options={options} value={value} onChange={handleTabChange} />
            <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
        </div>
    );
};

export default SelectTab;