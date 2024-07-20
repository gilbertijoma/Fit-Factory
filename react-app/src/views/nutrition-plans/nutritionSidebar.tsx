import { Component } from 'react'
import styles from './nutritionSidebar.module.css'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { Nutrition } from 'shared/models/nutrition'


import { NavLink } from "react-router-dom";
import { PlusCircledIcon } from "@radix-ui/react-icons";

export interface Filter{
  name: string,
  filter: any,
  property: keyof Nutrition;
}
export interface Filter2 {
	name: string
	filter: any
}
interface NutritionSidebarProps {
	onSortChange: (property: keyof Nutrition | 'none') => void
}

export default class NutritionSidebar extends Component<NutritionSidebarProps> {
	
    readonly length: Filter[] = [
      { name: 'Calories (Desc)', filter: {min: 0, max: 0}, property: 'calories' },
      { name: 'Protein (Desc)', filter: {min: 10, max: 15}, property: 'protein' },
      { name: 'Sugars (Asc)', filter: {min: 15, max: 25}, property: 'sugar' },
      { name: 'Total fat (Asc)', filter: {min: 25, max: 1000}, property: 'fat' }
    ]
  
    readonly bodyFocus: Filter2[] = [
      { name: 'Abs', filter: 'Abs',  },
      { name: 'Biceps', filter: 'Biceps' },
      { name: 'Triceps', filter: 'Triceps' },
      { name: 'Lats', filter: 'Lats' },
      { name: 'Calves', filter: 'Calves' },
    ]
  
    onFiltersSelected(filters: Filter[]){
      console.log(filters);
    }
    
  
    render() {
  
      return (
        <div>
          <div>
            <NavLink to='/nutrition/new'  className={styles.btnprimary1} >
              Create Nutrition Plan
              <PlusCircledIcon />
            </NavLink>
          </div>
          <div className={styles.filters}>
            <WorkoutsFilter title="Macros" filters={ this.length } onFilterSelected={this.onFiltersSelected} onSortChange={this.props.onSortChange} />
          {/* <WorkoutsFilter title="Body Focus" filters={ this.bodyFocus } onFilterSelected={this.onFiltersSelected} /> */}
          </div>
        </div>
      )
    }
  }
interface WorkoutsFilterProps {
	title: string
	filters: Filter[]
	onFilterSelected?(filters: Filter[]): any
	onSortChange: (property: keyof Nutrition | 'none') => void
}

interface WorkoutsFilterState {
	isCollapsed: boolean
	selectedFilterIndex: number
}

class WorkoutsFilter extends Component<WorkoutsFilterProps, WorkoutsFilterState, NutritionSidebarProps> {
	constructor(props: WorkoutsFilterProps) {
		super(props)
		this.state = { selectedFilterIndex: -1, isCollapsed: false }
	}

	toggleCollapse() {
		this.setState({
			isCollapsed: !this.state.isCollapsed,
		})
	}
	onFilterSelected(filter: Filter | null) {
		if (filter) {
			if (this.props.onSortChange) {
				this.props.onSortChange(filter.name.toLowerCase() as keyof Nutrition)
			}
		}
	}

	handleChecked(e: React.ChangeEvent<HTMLInputElement>) {
		const filterIndex = parseInt(e.target.value)
		const { selectedFilterIndex } = this.state

		let newSelectedFilterIndex = -1

		if (filterIndex === selectedFilterIndex) {
			// If the clicked filter is already selected, unselect it
			newSelectedFilterIndex = -1
		} else {
			// If the clicked filter is not already selected, select it
			newSelectedFilterIndex = filterIndex
		}

		this.setState({
			selectedFilterIndex: newSelectedFilterIndex,
		})

		const selectedFilter = newSelectedFilterIndex === -1 ? null : this.props.filters[newSelectedFilterIndex]

		if (this.props.onFilterSelected) {
			this.props.onFilterSelected(selectedFilter ? [selectedFilter] : [])
		}
		if (selectedFilter) {
			this.props.onSortChange(selectedFilter.property)
		}
	}
	// Inside NutritionSidebar component

	handleReset() {
		if (this.state.selectedFilterIndex != -1) {
			window.location.reload()
		}
	}

	render() {
		const { filters, title } = this.props
		const { isCollapsed, selectedFilterIndex } = this.state

		const filterItems = filters.map(({ name }, idx) => {
			return (
				<li key={idx} className={styles.filter}>
					<input
						type='radio'
						onChange={this.handleChecked.bind(this)}
						name={title}
						value={idx}
						checked={idx === selectedFilterIndex}
					/>
					<label htmlFor={name}>{name}</label>
				</li>
			)
		})

		return (
			<div className={styles.section + ' ' + (isCollapsed ? styles.collapsed : '')}>
				<div className={styles.header}>
					<p className={styles.title}>
						{title}
						{selectedFilterIndex !== -1 && <span className={styles['selected-count']}>(1)</span>}
					</p>
					<button className={styles.reset} onClick={this.handleReset.bind(this)}>
						Reset
					</button>
					<button
						className={styles.chevron + ' ' + (isCollapsed ? styles.collapsed : '')}
						onClick={this.toggleCollapse.bind(this)}>
						<ChevronUpIcon />
					</button>
				</div>
				<ul className={styles['filter-list']}>{filterItems}</ul>
			</div>
		)
	}
}
