import { defineStore } from 'pinia'
import { reactive } from 'vue'

export interface Task {
    id: number
    type: string
    title: string
    description?: string
    priority: string
    status: string
    reporter: string
    assignees: string[]
}

export interface Column {
    id: string
    title: string
    tasks: Task[]
}

export const useIssueStore = defineStore('issues', () => {
    const columns = reactive<Column[]>([
        {
            id: 'backlog',
            title: 'Backlog',
            tasks: [
                {
                    id: 1,
                    type: 'Bug',
                    title: 'Fix login API issue',
                    description: 'Users cannot log in due to API failure.',
                    priority: 'High',
                    status: 'To Do',
                    reporter: 'Alice',
                    assignees: ['Bob'],
                },
                {
                    id: 2,
                    type: 'Feature',
                    title: 'Implement dark mode',
                    description: 'Add dark mode support for better user experience.',
                    priority: 'Medium',
                    status: 'To Do',
                    reporter: 'Charlie',
                    assignees: ['Alice', 'David'],
                },
            ],
        },
        {
            id: 'todo',
            title: 'To Do',
            tasks: [
                {
                    id: 3,
                    type: 'Bug',
                    title: 'Fix login API issue',
                    description: 'Users cannot log in due to API failure.',
                    priority: 'High',
                    status: 'To Do',
                    reporter: 'Alice',
                    assignees: ['Bob'],
                },
                {
                    id: 4,
                    type: 'Feature',
                    title: 'Implement dark mode',
                    description: 'Add dark mode support for better user experience.',
                    priority: 'Medium',
                    status: 'To Do',
                    reporter: 'Charlie',
                    assignees: ['Alice', 'David'],
                },
            ],
        },
        {
            id: 'inprogress',
            title: 'In Progress',
            tasks: [
                {
                    id: 5,
                    type: 'Task',
                    title: 'Update documentation',
                    description: 'Update user guide with new features.',
                    priority: 'Low',
                    status: 'In Progress',
                    reporter: 'Eve',
                    assignees: ['Frank'],
                },
                {
                    id: 6,
                    type: 'Bug',
                    title: 'Fix image upload',
                    description: 'Images fail to upload on slow connections.',
                    priority: 'Medium',
                    status: 'In Progress',
                    reporter: 'Grace',
                    assignees: ['Helen'],
                },
            ],
        },
        {
            id: 'done',
            title: 'Done',
            tasks: [
                {
                    id: 7,
                    type: 'Bug',
                    title: 'Each issue has a single reporter but can have multiple assignees.',
                    description: 'Users cannot log in due to API failure.',
                    priority: 'Medium',
                    status: 'Done',
                    reporter: 'Alice',
                    assignees: ['Bob', 'Charlie', 'Alice'],
                },
                {
                    id: 8,
                    type: 'Feature',
                    title: 'Implement email notifications',
                    description: 'Send email notifications for task updates.',
                    priority: 'High',
                    status: 'Done',
                    reporter: 'Ivan',
                    assignees: ['Jack'],
                },
            ],
        },
    ])

    function addIssue(issue: Task) {
        const backlogColumn = columns.find((col) => col.id === 'backlog')
        if (backlogColumn) {
            backlogColumn.tasks.push(issue)
        }
    }

    function moveTask({
                          taskId,
                          sourceColumnId,
                          targetColumnId,
                          position,
                      }: {
        taskId: number
        sourceColumnId: string
        targetColumnId: string
        position: number
    }) {
        const sourceColumnIndex = columns.findIndex((col) => col.id === sourceColumnId)
        if (sourceColumnIndex === -1) return

        const targetColumnIndex = columns.findIndex((col) => col.id === targetColumnId)
        if (targetColumnIndex === -1) return

        const taskIndex = columns[sourceColumnIndex].tasks.findIndex((task) => task.id === taskId)
        if (taskIndex === -1) return


        const [movedTask] = columns[sourceColumnIndex].tasks.splice(taskIndex, 1)

        movedTask.status = columns[targetColumnIndex].title

        if (position >= 0 && position <= columns[targetColumnIndex].tasks.length) {
            columns[targetColumnIndex].tasks.splice(position, 0, movedTask)
        } else {
            columns[targetColumnIndex].tasks.push(movedTask)
        }
    }

    function deleteTask(taskId: number, columnId: string) {
        const columnIndex = columns.findIndex((col) => col.id === columnId)
        if (columnIndex === -1) return

        const taskIndex = columns[columnIndex].tasks.findIndex((task) => task.id === taskId)
        if (taskIndex === -1) return

        columns[columnIndex].tasks.splice(taskIndex, 1)
    }

    function updateTask({id, columnId, updatedTask}: { id: number, columnId: string, updatedTask: Task }) {
        const columnIndex = columns.findIndex((col) => col.id === columnId)
        if (columnIndex === -1) return

        const taskIndex = columns[columnIndex].tasks.findIndex((task) => task.id === id)
        if (taskIndex === -1) return

        columns[columnIndex].tasks[taskIndex] = updatedTask
    }

    return {
        columns,
        addIssue,
        moveTask,
        deleteTask,
        updateTask
    }
})