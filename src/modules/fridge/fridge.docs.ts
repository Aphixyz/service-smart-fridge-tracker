/**
 * @swagger
 * tags:
 *   name: Fridge
 *   description: Fridge management module
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Fridge:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         quantity:
 *           type: number
 *         category:
 *           type: string
 *     FridgeDetail:
 *       type: object
 *       properties:
 *         fridge_id:
 *           type: integer
 *         fridge_name:
 *           type: string
 *         location:
 *           type: string
 *         total_items:
 *           type: integer
 *         total_quantity:
 *           type: number
 *         total_categories:
 *           type: integer
 */

/**
 * @swagger
 * /fridges:
 *   get:
 *     summary: Get fridge details by user ID
 *     tags: [Fridge]
 *     parameters:
 *       - in: query
 *         name: authId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User authentication ID
 *     responses:
 *       200:
 *         description: Fridge details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FridgeDetail'
 *       404:
 *         description: Fridge not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
