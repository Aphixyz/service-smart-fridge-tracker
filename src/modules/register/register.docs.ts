/**
 * @swagger
 * tags:
 *   name: Register
 *   description: User registration module
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - password
 *         - confirmpassword
 *       properties:
 *         username:
 *           type: string
 *           minLength: 4
 *           maxLength: 20
 *           example: "johndoe"
 *           description: Username must be between 4 and 20 characters
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 20
 *           example: "John Doe"
 *           description: Full name must be between 2 and 20 characters
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 100
 *           example: "Password123"
 *           description: Password must be at least 6 characters and contain at least one number
 *         confirmpassword:
 *           type: string
 *           example: "Password123"
 *           description: Must match the password field
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "username: String must contain at least 4 character(s), password: String must contain at least one number(s)"
 *       409:
 *         description: Conflict - username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Username already exists"
 *       500:
 *         description: Internal server error
 */
