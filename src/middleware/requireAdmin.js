// Guards routes that change data. The password arrives in the `adminPassword`
// form field, added by the prompt in views/partials/head.ejs.
const requireAdmin = (req, res, next) => {
    const expected = process.env.ADMIN_PASSWORD
    const given = req.body?.adminPassword
    if (req.body) delete req.body.adminPassword

    // Fail closed if no password is configured
    if (expected && given === expected) return next()

    res.status(401).send(`<!doctype html>
<script>
    alert("Incorrect admin password.")
    history.back()
</script>`)
}

module.exports = { requireAdmin }
