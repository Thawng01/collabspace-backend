import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user.routes'
import loginRoutes from './routes/auth.routes'
import workspaceRoutes from './routes/workspace.routes'
import projectRoutes from './routes/project.routes'
import memberRoutes from './routes/member.routes'
import columnRoutes from './routes/column.routes'
import taskRoutes from './routes/task.routes'
import labelRoutes from './routes/label.routes'
import commentRoutes from './routes/comment.routes'
import activityRoutes from './routes/activity.routes'
import { config } from 'dotenv'

config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes)
app.use("/api/auth", loginRoutes)
app.use("/api/workspaces", workspaceRoutes)
app.use("/api/labels", labelRoutes)
app.use("/api/workspaces/members", memberRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/projects/columns", columnRoutes)
app.use("/api/projects/columns/tasks", taskRoutes)
app.use("/api/projects/columns/tasks/comments", commentRoutes)
app.use("/api/projects/columns/tasks/activities", activityRoutes)

const PORT = process.env.PORT || 9000

app.listen(PORT, () => console.log(`Listening to ${PORT}`))