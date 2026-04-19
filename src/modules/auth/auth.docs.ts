/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication module
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and set httpOnly auth cookie
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful and auth cookie set
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: HttpOnly authentication cookie
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Clear httpOnly auth cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
