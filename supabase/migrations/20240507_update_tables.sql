-- Drop existing tables if they exist
DROP TABLE IF EXISTS stock_events;
DROP TABLE IF EXISTS restocking_alerts;
DROP TABLE IF EXISTS product_thresholds;

-- Table for storing product-specific thresholds with snake_case
CREATE TABLE IF NOT EXISTS product_thresholds (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL,
  threshold INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (product_id)
);

-- Table for storing restocking alerts with snake_case
CREATE TABLE IF NOT EXISTS restocking_alerts (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  current_stock INTEGER NOT NULL,
  threshold INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Table for storing stock change events with snake_case
CREATE TABLE IF NOT EXISTS stock_events (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('update', 'restock', 'sale', 'adjustment')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID,
  notes TEXT
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_thresholds_product_id ON product_thresholds(product_id);
CREATE INDEX IF NOT EXISTS idx_restocking_alerts_product_id ON restocking_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_restocking_alerts_status ON restocking_alerts(status);
CREATE INDEX IF NOT EXISTS idx_stock_events_product_id ON stock_events(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_events_timestamp ON stock_events(timestamp);

-- Enable Row Level Security
ALTER TABLE product_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE restocking_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_events ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- For product_thresholds table
CREATE POLICY "Authenticated users can read product thresholds"
  ON product_thresholds
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert product thresholds"
  ON product_thresholds
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update product thresholds"
  ON product_thresholds
  FOR UPDATE
  TO authenticated
  USING (true);

-- For restocking_alerts table
CREATE POLICY "Authenticated users can read restocking alerts"
  ON restocking_alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert restocking alerts"
  ON restocking_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update restocking alerts"
  ON restocking_alerts
  FOR UPDATE
  TO authenticated
  USING (true);

-- For stock_events table
CREATE POLICY "Authenticated users can read stock events"
  ON stock_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stock events"
  ON stock_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stock events"
  ON stock_events
  FOR UPDATE
  TO authenticated
  USING (true); 