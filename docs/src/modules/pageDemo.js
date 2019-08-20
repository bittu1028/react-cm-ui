'use strict';

import {
    Dropdown,
    Header,
    Icon,
    Page,
    TitleBar,
} from 'react-cm-ui';
import moment from 'moment-timezone';
import React from 'react';

class PageDemo extends React.Component {
    constructor() {
        super();

        this.state = {
            isFiltersOpen: false,
        };

        this._onFiltersToggle = this._onFiltersToggle.bind(this);
    }

    render() {
        const { isFiltersOpen } = this.state;
        const isMobile = 700;

        return (
            <React.Fragment>
                <div>
                    <div className="hidden-spacer" />

                    <TitleBar title="Page Components Demo" />
                </div>

                <Page
                    className="page-class-name"
                    style={{
                        minHeight: 'calc(100vh - 140px)',
                    }}
                >
                    <Page.ActionBar>
                        <Icon
                            onClick={this._onFiltersToggle}
                            type="filter"
                        />
                    </Page.ActionBar>

                    <Page.Container>
                        <Page.FiltersDrawer
                            isOpen={isFiltersOpen}
                            onClose={this._onFiltersToggle}
                        >
                            FilterDrawer
                        </Page.FiltersDrawer>

                        <Page.FiltersRail
                            isOpen={isFiltersOpen}
                            onClose={this._onFiltersToggle}
                        >
                            <Header weight="bold">Sort By</Header>

                            <Dropdown
                                clearable={false}
                                options={[
                                    {
                                        label: 'Name (Ascending)',
                                        value: 'Name (Ascending)',
                                    }, {
                                        label: 'Name (Descending)',
                                        value: 'Name (Descending)',
                                    }, {
                                        label: 'Create Date (Ascending)',
                                        value: 'Create Date (Ascending)',
                                    }, {
                                        label: 'Create Date (Descending)',
                                        value: 'Create Date (Descending)',
                                    },
                                ]}
                                searchable={false}
                                selection
                                selectionUnderline
                                value={{
                                    label: 'Name (Ascending)',
                                    value: 'Name (Ascending)',
                                }}
                            />

                            <Header weight="bold">Campus</Header>

                            <Dropdown
                                clearable={false}
                                options={[
                                    {
                                        label: 'All Campuses',
                                        value: 'All Campuses',
                                    }, {
                                        label: 'Lake Forest',
                                        value: 'Lake Forest',
                                    },
                                ]}
                                searchable={false}
                                selection
                                selectionUnderline
                                value={{
                                    label: 'All Campuses',
                                    value: 'All Campuses',
                                }}
                            />
                        </Page.FiltersRail>

                        <Page.Content
                            className="page-content-class-name"
                            isFiltersRailOpen={isFiltersOpen}
                        >
                            <Page.Details
                                color={11}
                                columns={[
                                    {
                                        accessor: () => {
                                            return 'Super Cool Info Bar - Color: 11';
                                        },
                                        fontSize: 'large',
                                        fontWeight: 'semibold',
                                        header: null,
                                        style: {
                                            marginBottom: '11px',
                                        },
                                        width: '100%',
                                    }, {
                                        accessor: d => {
                                            return (
                                                <div>Chart</div>
                                            );
                                        },
                                        fontWeight: 'bold',
                                        header: null,
                                    }, {
                                        accessor: 'activeTemplates',
                                        header: 'Active Templates',
                                    }, {
                                        accessor: 'inactiveTemplates',
                                        header: 'Inactive Templates',
                                    }, {
                                        columns: [
                                            {
                                                accessor: 'activeTemplates',
                                                header: 'Active Templates',
                                            }, {
                                                accessor: 'inactiveTemplates',
                                                header: 'Inactive Templates',
                                            },
                                        ],
                                        divide: true,
                                    },
                                ]}
                                data={{
                                    activeTemplates: 4,
                                    id: 1,
                                    inactiveTemplates: 2,
                                }}
                            />

                            {!isMobile && viewType === 'table' ? (
                                <Page.Table
                                    columns={[
                                        {
                                            accessor: 'name',
                                            header: 'Names',
                                        }, {
                                            accessor: 'campus',
                                            header: 'Campus',
                                        }, {
                                            accessor: d => {
                                                return moment.unix(d.createdOn).utc().format('L');
                                            },
                                            header: 'Created On',
                                        }, {
                                            accessor: () => <Icon compact size="xxsmall" type="chevron-right" />,
                                            header: null,
                                            textAlign: 'right',
                                        },
                                    ]}
                                    data={[
                                        {
                                            campus: 'Lake Forest',
                                            createdOn: 1259668810,
                                            id: 1,
                                            name: 'First Time Visitor',
                                        }, {
                                            campus: 'Lake Forest',
                                            createdOn: 1159668810,
                                            id: 2,
                                            name: 'Second Time Visitor',
                                        }, {
                                            campus: 'Anaheim',
                                            createdOn: 1152668810,
                                            id: 3,
                                            name: 'Class 101 Invite',
                                        },
                                    ]}
                                    rowProps={() => {
                                        return {
                                            onClick: this._onTableRowClick,
                                        };
                                    }}
                                />
                            ) : (
                                <Page.Grid
                                    cardProps={() => {
                                        return {
                                            onClick: this._onCardClick,
                                        };
                                    }}
                                    columns={[
                                        {
                                            accessor: 'name',
                                            fontSize: 'medium',
                                            fontWeight: 'semibold',
                                            header: false,
                                            width: '100%',
                                        }, {
                                            accessor: 'campus',
                                            fontWeight: 'bold',
                                            header: 'Campus',
                                        }, {
                                            accessor: d => {
                                                return moment.unix(d.createdOn).utc().format('L');
                                            },
                                            fontWeight: 'bold',
                                            header: 'Created On',
                                        },
                                    ]}
                                    data={[
                                        {
                                            campus: 'Lake Forest',
                                            createdOn: 1259668810,
                                            id: 1,
                                            name: 'First Time Visitor',
                                        }, {
                                            campus: 'Lake Forest',
                                            createdOn: 1159668810,
                                            id: 2,
                                            name: 'Second Time Visitor',
                                        }, {
                                            campus: 'Anaheim',
                                            createdOn: 1152668810,
                                            id: 3,
                                            name: 'Class 101 Invite',
                                        },
                                    ]}
                                />
                            )}
                        </Page.Content>
                    </Page.Container>
                </Page>
            </React.Fragment>
        );
    }

    _onFiltersToggle() {
        const { isFiltersOpen } = this.state;

        this.setState({
            isFiltersOpen: !isFiltersOpen,
        });
    }
}

export default PageDemo;
