'use strict';

import _ from 'lodash';
import ClassNames from 'classnames';
import MediaQuery from 'react-responsive';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ScrollBar from 'react-custom-scrollbars';
import Select from 'react-select';

import Button from '../Elements/Button.react';
import DropdownItem from './DropdownItem.react';
import Icon from '../Elements/Icon.react';
import Modal from './Modal.react';

import Utils from '../utils/Utils.js';
import DOMUtils from '../utils/DOMUtils.js';

class CustomSelect extends Select {
    renderHiddenField(valueArray) {
        const options = this._visibleOptions = this.filterOptions(this.props.multi && this.props.removeSelected ? valueArray : null);
        const menu = this.renderMenu(options, valueArray);
        const styles = Object.assign({}, this.props.menuContainerStyle, {visibility: 'hidden'});
        return (
            <div className="Select-menu-outer" style={styles}>
                <div role="listbox" tabIndex={-1} className="Select-menu" id={this._instancePrefix + '-list'} style={this.props.menuStyle}>
                    {menu}
                </div>
            </div>
        );
    }
};

const customCreatableSelect = props => <CustomSelect {...props}/>;

class Dropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            menuIsOpen: false,
            menuXPosition: 'left',
            menuYPosition: 'top',
            value: props.value || null
        };

        this._onClickOutsideRef = this._onClickOutside.bind(this);
        this._onDropdownMenuRepositionRef = this._onDropdownMenuReposition.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props, nextProps)) {
            this.setState({
                menuIsOpen: !_.isEqual(this.props.value, nextProps.value),
                value: nextProps.value
            });
        }
    }

    render() {
        const { button, buttonColor, buttonCompact, children,
            className, clearable, disable, fluid, iconColor,
            iconInverse, iconSize, iconType, inverse, label, labelStyle,
            options, placeholder, searchable, selection,
            selectionCreatable, selectionMenuContainerStyle: menuContainerStyle, selectionMenuStyle,
            selectionMobile, selectionOptionComponent, selectionValueComponent, selectionMultiple, selectionRequired,
            style, tabIndex, theme } = this.props;
        const isButtonDisabled = buttonColor === 'disable';
        const containerClasses = ClassNames('ui', 'dropdown', className, {
            'dropdown-button': button,
            'dropdown-button-compact': buttonCompact,
            'dropdown-color-alert': buttonColor === 'alert',
            'dropdown-color-disable': disable || buttonColor === 'disable',
            'dropdown-color-inverse': buttonColor === 'inverse',
            'dropdown-color-light': buttonColor === 'light',
            'dropdown-color-outline': buttonColor === 'outline',
            'dropdown-color-primary': !buttonColor || buttonColor === 'primary',
            'dropdown-color-alternate': buttonColor === 'alternate',
            'dropdown-color-success': buttonColor === 'success',
            'dropdown-disable': disable,
            'dropdown-fluid': fluid,
            'dropdown-icon': iconType,
            'dropdown-inverse': inverse,
            'dropdown-is-active': this.state.menuIsOpen,
            'dropdown-menu-theme-dark': theme === 'dark',
            'dropdown-menu-theme-light': theme === 'light',
            'dropdown-selection': selection
        });
        let items, labelJSX;

        if (label) {
            labelJSX = (
                <label className="label" style={labelStyle}>
                    {label}

                    {selectionRequired && !this.state.value ? (
                        <span className="input-required-indicator">*</span>
                    ) : null}
                </label>
            );
        }

        if (children && !selection) {
            const convertChildren = _.isArray(children) ? children : [ children ];
            items = _.map(convertChildren, (child, index) => {
                const { iconColor, iconInverse, iconType, id, label } = child.props;
                const itemClass = ClassNames('dropdown-item', {
                    'dropdown-item-is-selected': this.state.value ? this.state.value.label === label : false
                });
                const value = {
                    id: id,
                    label: label
                }

                return (
                    <li
                        className={itemClass}
                        key={'dropdown-menu-item-' + index}
                    >
                        <span onClick={this._onDropdownMenuItemClick.bind(this, value)}>
                            {iconType ? <Icon inverse={iconInverse} color={iconColor} type={iconType} /> : null}
                            {value.label}
                        </span>
                    </li>
                );z
            });
        }

        if (selection) {
            const selectionMenuContainerStyle = Object.assign({}, {
                top: this.state.menuYPosition === 'bottom' ? 'initial' : '100%',
                bottom: this.state.menuYPosition === 'bottom' ? '100%' : 'initial',
                marginTop: this.state.menuYPosition === 'bottom' ? 0 : '4px',
                marginBottom: this.state.menuYPosition === 'bottom' ? '4px' : 0
            }, menuContainerStyle);

            if (!selectionCreatable) {
                return (
                    <MediaQuery maxWidth={767}>
                        {matches => {
                            if (selectionMobile && matches) {
                                return (
                                    <div
                                        className={containerClasses}
                                        ref="dropdownSelectionContainer"
                                        style={style}
                                    >
                                        {labelJSX}

                                        <div
                                            className="dropdown-selection-mobile-button"
                                            onClick={this._onSelectionMobileModalToggle.bind(this)}
                                        >
                                            {placeholder && !this.state.value ? (
                                                <span className="placeholder">{placeholder}</span>
                                            ) : (
                                                <span className="label">{this.state.value.label}</span>
                                            )}

                                            <Icon color={disable ? 'disable' : null} compact={true} type="arrows-alt" />
                                        </div>

                                        <Modal
                                            isOpen={this.state.isModalOpen}
                                            onClose={this._onSelectionMobileModalToggle.bind(this)}
                                            title={placeholder}
                                        >
                                            {this._onSelectionMobileItemRenderer()}
                                        </Modal>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        className={containerClasses}
                                        ref="dropdownSelectionContainer"
                                        style={style}
                                    >
                                        {labelJSX}

                                        <CustomSelect
                                            arrowRenderer={() => <Icon compact={true} size="xsmall" type="chevron-wl-down" />}
                                            clearRenderer={() => <Icon compact={true} size="xsmall" type="times" />}
                                            clearable={!clearable ? clearable : true}
                                            disabled={disable}
                                            menuContainerStyle={selectionMenuContainerStyle}
                                            menuRenderer={this._menuRenderer.bind(this)}
                                            menuStyle={selectionMenuStyle}
                                            multi={selectionMultiple}
                                            name="firstSelect"
                                            onChange={this._onChange.bind(this)}
                                            onOpen={this._onSelectionMenuOpen.bind(this)}
                                            optionComponent={selectionOptionComponent}
                                            options={options}
                                            placeholder={placeholder}
                                            searchable={!searchable ? searchable : true}
                                            tabIndex={_.isNumber(tabIndex) ? tabIndex.toString() : tabIndex}
                                            value={this.state.value}
                                            valueComponent={selectionValueComponent}
                                            ref="dropdownContainer"
                                        />
                                    </div>
                                );
                            }
                        }}
                    </MediaQuery>
                );
            } else if (selectionCreatable) {
                return (
                    <div
                        className={containerClasses}
                        ref="dropdownSelectionContainer"
                        style={style}
                    >
                        {labelJSX}

                        <Select.Creatable
                            arrowRenderer={() => <Icon compact={true} size="xsmall" type="chevron-wl-down" />}
                            clearRenderer={() => <Icon compact={true} size="xsmall" type="times" />}
                            clearable={!clearable ? clearable : true}
                            disabled={disable}
                            menuContainerStyle={selectionMenuContainerStyle}
                            menuRenderer={this._menuRenderer.bind(this)}
                            menuStyle={selectionMenuStyle}
                            multi={selectionMultiple}
                            name="firstSelect"
                            onChange={this._onChange.bind(this)}
                            onOpen={this._onSelectionMenuOpen.bind(this)}
                            optionComponent={selectionOptionComponent}
                            options={options}
                            placeholder={placeholder}
                            searchable={!searchable ? searchable : true}
                            tabIndex={_.isNumber(tabIndex) ? tabIndex.toString() : tabIndex}
                            value={this.state.value}
                            valueComponent={selectionValueComponent}
                            ref="dropdownContainer"
                        >
                            {customCreatableSelect}
                        </Select.Creatable>
                    </div>
                );
            }
        }

        return (
            <div
                className={containerClasses}
                onClick={this._onDropdownClick.bind(this)}
                ref="dropdownContainer"
                style={style}
            >
                {labelJSX}

                {placeholder ? (
                    <span className="dropdown-selection-value" key="dropdown-selection-value-key">
                        {this.state.value ? this.state.value.label : placeholder}
                    </span>
                ) : null}

                <Icon
                    color={this.state.menuIsOpen && !button ? 'highlight' : null}
                    compact={true}
                    inverse={iconInverse}
                    size={iconSize || 'xxsmall'}
                    type={iconType || 'caret-down'}
                />

                <MediaQuery maxWidth={767}>
                    {matches => {
                        return (
                            <ul
                                className="dropdown-menu"
                                onClick={this._onDropdownMenuClick.bind(this)}
                                ref={el => this.dropdownMenu = el}
                                style={{
                                    bottom: this.state.menuYPosition === 'bottom' && button ?
                                                matches ? '49px' : '39px' :
                                            this.state.menuYPosition === 'bottom' && !button ?
                                                '27px' :
                                                null,
                                    left: this.state.menuXPosition === 'left' ? 0 : null,
                                    opacity: this.state.menuIsOpen ? 1 : 0,
                                    right: this.state.menuXPosition === 'right' ? 0 : null,
                                    top: this.state.menuYPosition === 'top' && button ?
                                            matches ? '49px' : '39px' :
                                         this.state.menuYPosition === 'top' && !button ?
                                            '27px' :
                                            null,
                                    visibility: this.state.menuIsOpen ? 'visible' : 'hidden'
                                }}
                            >
                                {items}
                            </ul>
                        );
                    }}
                </MediaQuery>
            </div>
        );
    }

    componentDidMount() {
        document.addEventListener('click', this._onClickOutsideRef);
        document.addEventListener('scroll', this._onDropdownMenuRepositionRef);
        this._onDropdownMenuRepositionRef();
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._onClickOutsideRef);
        document.removeEventListener('scroll', this._onDropdownMenuRepositionRef);
    }

    _menuRenderer(params) {
        const items = _.map(params.options, (o, i) => {
            if (this.props.selectionOptionComponent) {
                const OptionComponent = this.props.selectionOptionComponent;

                return (
                    <OptionComponent
                        isFocused={params.isFocused}
                        key={`select-option-key-${i}`}
                        onFocus={() => params.onFocus(o)}
                        onSelect={() => params.selectValue(o)}
                        option={o}
                    />
                );
            }

            return (
                <div
                    className="Select-option"
                    key={`select-option-key-${i}`}
                    onClick={() => params.selectValue(o)}
                    onMouseOver={() => params.focusOption(o)}
                >
                    {o.label}
                </div>
            );
        });

        return (
            <ScrollBar
                autoHeight={true}
                autoHeightMax={this.props.menuMaxHeight || 180}
                autoHeightMin={this.props.menuMinHeight}
                autoHide={true}
                className="select-menu-scrollbar"
                ref={el => this.dropdownMenu = el}
            >
                {items}
            </ScrollBar>
        );
    }

    _onChange(selectedOption) {
        if (!_.isUndefined(this.props.onChange)) {
            this.props.onChange(selectedOption);
        } else {
            this.setState({ value: selectedOption });
        }
    }

    _onClickOutside(event) {
        if (this.refs.dropdownContainer && ReactDOM.findDOMNode(this.refs.dropdownContainer).contains(event.target) && this.state.menuIsOpen) {
            return;
        }

        this.setState({ menuIsOpen: false });
    }

    _onDropdownClick(event) {
        event.stopPropagation();

        if (!this.props.disable) {
            this.setState({
                menuIsOpen: !this.state.menuIsOpen
            });
        }
    }

    _onDropdownMenuItemClick(selectedOption, event) {
        event.stopPropagation();

        this._onChange(selectedOption)
    }

    _onDropdownMenuClick(event) {
        // Prevents click event from bubbling up and closing the menu
        event.stopPropagation();
    }

    _onDropdownMenuReposition() {
        const { menuXPosition, menuYPosition } = this.state;
        const dropdownMenuObj = DOMUtils.isInViewport(ReactDOM.findDOMNode(this.dropdownMenu));
        const isInTop = dropdownMenuObj.isInTop;
        const isInRight = dropdownMenuObj.isInRight;
        const isInBottom = dropdownMenuObj.isInBottom;
        const isInLeft = dropdownMenuObj.isInLeft;
        let newMenuXPosition, newMenuYPosition;

        if (!isInLeft || !isInLeft && isInRight) {
            newMenuXPosition = 'left';
        } else if (!isInRight || isInLeft && !isInRight) {
            newMenuXPosition = 'right';
        } else if (isInLeft && isInRight) {
            newMenuXPosition = menuXPosition;
        }

        if (!isInTop || !isInTop && isInBottom) {
            newMenuYPosition = 'top';
        } else if (!isInBottom || isInTop && !isInBottom) {
            newMenuYPosition = 'bottom';
        } else if (isInTop && isInBottom) {
            newMenuYPosition = menuYPosition;
        }

        this.setState({
            menuXPosition: newMenuXPosition,
            menuYPosition: newMenuYPosition
        });
    }

    _onSelectionMenuOpen() {
        // debugger;
    }

    _onSelectionMobileModalToggle() {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    _onSelectionMobileItemClick(selectedOption) {
        this._onChange(selectedOption);
        this._onSelectionMobileModalToggle();
    }

    _onSelectionMobileItemRenderer() {
        const items = _.map(this.props.options, (o, i) => {
            return (
                <Button
                    className="Select-option"
                    color="light"
                    compact={true}
                    fluid={true}
                    inverse={true}
                    key={`select-option-key-${i}`}
                    onClick={this._onSelectionMobileItemClick.bind(this, o)}
                    style={{
                        margin: '3px 0',
                        textAlign: 'left'
                    }}
                >
                    {o.label}
                </Button>
            );
        });

        return items;
    }

    _valueRenderer() {

    }

}

Dropdown.Item = DropdownItem;

Dropdown.propTypes = {
    button: React.PropTypes.bool,
    buttonColor: React.PropTypes.oneOf(Utils.colorEnums()),
    buttonCompact: React.PropTypes.bool,
    className: React.PropTypes.string,
    clearable: React.PropTypes.bool,
    disable: React.PropTypes.bool,
    fluid: React.PropTypes.bool,
    iconColor: React.PropTypes.oneOf(Utils.colorEnums()),
    iconInverse: React.PropTypes.bool,
    iconSize: React.PropTypes.oneOf(Utils.sizeEnums()),
    iconType: React.PropTypes.string,
    inverse: React.PropTypes.bool,
    label: React.PropTypes.string,
    labelStyle: React.PropTypes.object,
    menuMaxHeight: React.PropTypes.number,
    menuMinHeight: React.PropTypes.number,
    onChange: React.PropTypes.func,
    options: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    searchable: React.PropTypes.bool,
    selectionCreatable: React.PropTypes.bool,
    selectionMenuContainerStyle: React.PropTypes.object,
    selectionMenuStyle: React.PropTypes.object,
    selectionMobile: React.PropTypes.bool,
    selectionMultiple: React.PropTypes.bool,
    selectionOptionComponent: React.PropTypes.func,
    selectionRequired: React.PropTypes.bool,
    selectionValueComponent: React.PropTypes.func,
    style: React.PropTypes.object,
    tabIndex: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string
    ]),
    theme: React.PropTypes.oneOf(Utils.themeEnums()),
    value: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.number,
        React.PropTypes.object,
        React.PropTypes.string
    ])
};

export default Dropdown;
